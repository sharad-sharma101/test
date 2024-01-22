import blocksBasic from "grapesjs-blocks-basic";
const { VITE_EDITOR_BASE_API_URL: BASE_URL } = import.meta.env;

function getEditorConfigs(
	html: string,
	style: string,
	containerId: string, // editor id
	plugins: [] = [],
	pluginsOpts: { [key: string]: any } = {}
) {
	return {
		container: containerId,
		components: html,
		allowScripts: 1,
		style: style,
		plugins: [blocksBasic, ...plugins],
		pluginsOpts: {
			"gjs-blocks-basic": { flexGrid: true },
			"grapesjs-tabs": {
				tabsBlock: { category: "Extra" },
			},
			...pluginsOpts,
		},
		// storageManager: {
		// 	type: "remote",
		// 	// stepsBeforeSave: 1, // Save on the first step, which is the button click
		// 	// autosave: true, // Disable the default autosave behavior,
		// },

		storageManager: {
			// type: 'remote',
			// autosave: true,
			// autoload: true,
			// stepsBeforeSave: 1,
			// contentTypeJson: true,
			// storeOnChange: true,

			autosave: false, // Disable autosave
			setStepsBeforeSave: 0, // Set the number of steps before the save is triggered (0 means immediate)
			type: null, // Disable storage type (local, remote, etc.)
			stepsBeforeSave: 0,
			noticeOnUnload: 0,
		  },

		  canvas: {
			
			customBadgeLabel: 'Canvas',
			stretchCanvas: 1,
			refreshStyle: true, // Enable the refreshStyle option
		  },
	};
}

export { getEditorConfigs };