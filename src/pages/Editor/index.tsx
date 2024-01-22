// @ts-nocheck
import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./index.sass"
import { Button } from "@attrybtech/attryb-ui"
import Editor from "../../components/editor/editor"
import AppHeader from "../../components/header"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { objectKeys } from "../../utils/helpers"
import { createTemplate, getTemplate, updateTemplate } from "../../components/editor/api"
import { AuthContext } from "../../auth/AuthContext"

export default function EditorView() {
	const [template, setTemplate] = useState(null)
	const [templateId, settemplateId] = useState('64c39e129cf3c9f459ae4d43')
	const navigate = useNavigate()
	const { containerId, accountId, variantId } = useParams();
	const {template: selectedTemplate  }=useAppSelector((store)=>store.templateConfigs)

	useEffect(() => {
	  settemplateId(selectedTemplate._id)
	  setTemplate(selectedTemplate)
	}, [selectedTemplate])
	
	// useEffect(()=>{
	// 	fetchTemplate()
	// },[])

	// const fetchTemplate = async () => {
	// 	const response = await getTemplate(templateId) || {}
	// 	setTemplate(response)
	// }

	const handleSaveTemplate = async (editor: grapesjs.Editor, name) =>{
		try {
			const data = getEditorContent(editor);
			/**
			 * if id is not provided by the consumer
			 * then create a templated based on the apiPayload
			 */

			data.name = name
			//  update the content of the templated with the provided id
			await updateTemplate(templateId, data);
		  } catch (error) {
			console.log(error);
		  }
	}

	const handleSaveAndExit = async () => {
		// navigate(`/${accountId}/${containerId}/${variantId}/configurations`)		
	}

	const getEditorContent = (editor: grapesjs.Editor) => {
		const html:string = editor.getHtml() || ""
		const css = editor.getCss() || ""
		return { html, css };
	  };

	return (
		<div className="editor-section-wrapper">
			<Editor template={template} handleSaveTemplate={handleSaveTemplate} handleSaveAndExit={handleSaveAndExit} /> 
		</div>
	)
}
