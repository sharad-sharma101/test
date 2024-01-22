import React,{useEffect, useState} from "react";
import "./index.sass";


const STEP_STATUS = {
	active:"active",
	completed:"completed",
	pending:"pending"
}

function ProgressSteps({ steps=[], activeStep }:ProgressSteps) {
	const [activeIdx, setActiveIdx] = useState(0)

	useEffect(()=>{
		const stepIdx = steps.findIndex( step => step.id === activeStep.id )
		setActiveIdx(stepIdx)
	},[activeStep])


	const stepStatus = (index:number) => {
		if(activeIdx > index) return STEP_STATUS.completed
		if(activeIdx < index) return STEP_STATUS.pending
		return STEP_STATUS.active
	}

	const isNextStep = (length:number, index:number) => {
		return index < length - 1;
	};

	return (
		<div className="progress-section">
			<div className="progress-container">
				{steps.map((step:ProgressStep, idx:number) => (
                    <div key={idx} className={`progress-step ${!isNextStep(steps.length, idx ) ? "--last-step" : ""}`}>
                        <div className={`progress`}>
                            <div className={`progress-step__prefix ${stepStatus(idx)}`}>
                                <span>{step.prefix}</span>
                            </div>
                            <div className="progress-step__body">{step.body}</div>
                        </div>
                        {isNextStep(steps.length, idx ) && <div className= {`${stepStatus(idx)} progress-step__bar`}></div>}
                    </div>
				))}
			</div>
		</div>
	);
}

export default ProgressSteps;