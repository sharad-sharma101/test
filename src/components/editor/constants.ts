export const SERVER_ROUTES = {
	references: "/references/templates",
	users: "/templates",
};

export const COMMANDS = {
	save: "save",
};

export const EDITOR_ID = "#editor";

export const TEMPLATES_TYPES = {
	custom:"CUSTOM"
}


 export const progressSteps = [
    {
      stageName: "Select Template",
      stageInstruction: "Choose a Template for your Campaign",
      route:"template"
    },
    {
      stageName: "Select Pages",
      stageInstruction: "Choose which pages to display on",
      route:"pages"
    },
    {
      stageName: "Set Configuration",
      stageInstruction: "Configure how your Campaign will work",
      route:"trigger"
    },
    {
      stageName: "Placement and Design",
      stageInstruction: "Choose the Placement and Design",
      route:"placement"
    },
    {
      stageName: "Schedule",
      stageInstruction: "Go Live instantly or Schedule the Variant",
      route:"schedule"
    },

  ]