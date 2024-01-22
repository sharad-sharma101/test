import "./index.sass";
import ConfigurationAccordion from "../../../components/ConfigurationAccordion";
import AllTriggersBody from "./AllTriggersBody";

const AllTriggers = ({
  triggersData
}: any) => {


  return (
    <div className="all-trigger-container">
      <ConfigurationAccordion
        heading="Triggers"
        subHeading="Create custom conditions for when a Use Case is to be triggered"
        children={AllTriggersBody({triggersData})}
        defaultOpen={true}
      />
    </div>
  );
};

export default AllTriggers;