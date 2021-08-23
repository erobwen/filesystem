import { observable } from "mobx";

/**
 * Production settings (./mybuild)
 *
 * Note: File had to be in src/, since it could not be placed in the project root. 
 */
export let production = true; 

// Feature switches (for features in development)
// A benefit of putting your variables within featureSwitches is that your 
// system still builds with an outdated config.js file. It just means that 
// all new switches will be off by default. 
export const featureSwitches = observable({
  splitPanelUnsorted: true,
  unionFolders: false,
  showAdvanced: false,
  intermediaryClosed: true, 
});

// featureSwitches.splitPanelUnsorted = true;
global.features = featureSwitches;

/**
 * Development settings. (./mystart) 
 */
if (true) { // || process.env.NODE_ENV === "development" how to check for develop mode? 
	production = false; 

	// Activate feature switches here
	// featureSwitches.myFeature = true;	
}
