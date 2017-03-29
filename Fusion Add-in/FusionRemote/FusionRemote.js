//Author-Dmytro Yemelianov
//Description-Chat bot for Autodesk Forge

//socket server 
var socketServerURL = 'https://fusion-remote.herokuapp.com';
var socketObj = null; 

//command
var commandIdOnQAT  = 'fusionRemote';
var commandIdOnPanel  = 'fusionRemote';

//intial value before driving the parameter
var initialV;

var errorDescription = function(e) {
    return (e.description ? e.description : e);
};

var commandDefinitionById = function(id) {
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    if (!id) {
        ui.messageBox('commandDefinition id is not specified');
        return null;
    }
    var commandDefinitions_ = ui.commandDefinitions;
    var commandDefinition_ = commandDefinitions_.itemById(id);
    return commandDefinition_;
};

var commandControlByIdForQAT = function(id) {
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    if (!id) {
        ui.messageBox('commandControl id is not specified');
        return null;
    }
    var toolbars_ = ui.toolbars;
    var toolbarQAT_ = toolbars_.itemById('QAT');
    var toolbarControls_ = toolbarQAT_.controls;
    var toolbarControl_ = toolbarControls_.itemById(id);
    return toolbarControl_;
};

var commandControlByIdForPanel = function(id) {
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    if (!id) {
        ui.messageBox('commandControl id is not specified');
        return null;
    }
    var workspaces_ = ui.workspaces;
    var modelingWorkspace_ = workspaces_.itemById('FusionSolidEnvironment');
    var toolbarPanels_ = modelingWorkspace_.toolbarPanels;
    var toolbarPanel_ = toolbarPanels_.item(0);
    var toolbarControls_ = toolbarPanel_.controls;
    var toolbarControl_ = toolbarControls_.itemById(id);
    return toolbarControl_;
};

var destroyObject = function(uiObj, tobeDeleteObj) {
    if (uiObj && tobeDeleteObj) {
        if (tobeDeleteObj.isValid) {
            tobeDeleteObj.deleteMe();
        } else {
            uiObj.messageBox('tobeDeleteObj is not a valid object');
        }
    }
};

function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var ui;
    try {
        var commandName = 'Fusion Remote';
        var commandDescription = 'Fusion Remote';
        var commandResources = './resources';
        
        var app = adsk.core.Application.get();
        ui = app.userInterface;
		
		var product = app.activeProduct;
		var design = adsk.fusion.Design(product);
        
		var  userName = app.userName;

        var onInputChanged = function(args) {
            try
            {
                var command = adsk.core.Command(args.firingEvent.sender);
				var inputs = command.commandInputs;
				
				var isToggleSocketInput = inputs.itemById('toggleSocket');
				var isToggleSocket = isToggleSocketInput.value; 
				
				if(isToggleSocket){
					if(socketObj == null)
					    socketObj =  io(socketServerURL);
					
					if(socketObj){	
						 socketObj.off(userName);		
						 socketObj.on('Fusion JS', function(msg){ 
							var app = adsk.core.Application.get();
							var ui = app.userInterface;
                            eval(msg);
						});     
					}
				}
				else{
					args.isValidResult = true;
 					if(socketObj)
						socketObj.off(userName);
				}
				
            } catch (e) {
                ui.messageBox('Input changed event failed: ' + errorDescription(e));
            }
        };

        var onCommandExecuted = function(args) {
            try {
                var command = adsk.core.Command(args.firingEvent.sender); 
		
				  if(socketObj){
						var app = adsk.core.Application.get();        
						var  userName = app.userName;
						socketObj.off(userName);
					}

            } catch (e) {
                ui.messageBox('command executed failed: ' + errorDescription(e));
            }
        };

        var onCommandCreatedOnPanel = function(args) {
            try {
               
               //for the addin that is loaded on startup, current product will be null
               //when swithching the default document to the other. So try to get it again.
               product = app.activeProduct;
               design = adsk.fusion.Design(product);

                var command = args.command;
                command.execute.add(onCommandExecuted);
                command.inputChanged.add(onInputChanged);
               
                var commandInputs_ = command.commandInputs;
				commandInputs_.addBoolValueInput('toggleSocket', 'Remote Enabled', true);		
                                
 
            } catch (e) {
                ui.messageBox('Panel command created failed: ' + errorDescription(e));
            }
        };

        var commandDefinitions_ = ui.commandDefinitions;

        // add a command on create panel in modeling workspace
        var workspaces_ = ui.workspaces;
        var modelingWorkspace_ = workspaces_.itemById('FusionSolidEnvironment');
        var toolbarPanels_ = modelingWorkspace_.toolbarPanels;
        var toolbarPanel_ = toolbarPanels_.item(0); // add the new command under the first panel
        var toolbarControlsPanel_ = toolbarPanel_.controls;
        var toolbarControlPanel_ = toolbarControlsPanel_.itemById(commandIdOnPanel);
        if (!toolbarControlPanel_) {
            var commandDefinitionPanel_ = commandDefinitions_.itemById(commandIdOnPanel);
            if (!commandDefinitionPanel_) {
                commandDefinitionPanel_ = commandDefinitions_.addButtonDefinition(commandIdOnPanel, commandName, commandDescription, commandResources);
            }
            commandDefinitionPanel_.commandCreated.add(onCommandCreatedOnPanel);
            toolbarControlPanel_ = toolbarControlsPanel_.addCommand(commandDefinitionPanel_, commandIdOnPanel);
            toolbarControlPanel_.isVisible = true;
         }
    }
    catch (e) {
        if (ui) {
            ui.messageBox('AddIn Start Failed : ' + errorDescription(e));
        }
    }
}

function stop(context) {
    var ui;
    try {
	    
        var app = adsk.core.Application.get();
        ui = app.userInterface;
		var  userName = app.userName;

				
         var objArrayPanel = []; 
		
		if(socketObj) 
			socketObj.off(userName);
						 
        
        var commandControlPanel_ = commandControlByIdForPanel(commandIdOnPanel);
        if (commandControlPanel_) {
            objArrayPanel.push(commandControlPanel_);
        }
        var commandDefinitionPanel_ = commandDefinitionById(commandIdOnPanel);
        if (commandDefinitionPanel_) {
            objArrayPanel.push(commandDefinitionPanel_);
        }
 
        objArrayPanel.forEach(function(obj){
            destroyObject(ui, obj);
        });

    } catch (e) {
        if (ui) {
            ui.messageBox('AddIn Stop Failed : ' + errorDescription(e));
        }
    }
}