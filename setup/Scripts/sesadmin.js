//
//   File:          %PM%
//   Revision:      %PR%
//   Date:          %PUDT%
//
//   DESCRIPTION:
//      javascript functions:
//              generateMisFolders: creating mis directories
//              log:                logging function call
//
function generateMisFolders() {
  try {
    // See also Product.wxs, CustomAction prepareGenerateMisFolders.
    // The value of the "CustomActionData" property is:
    // "[COMMON];[MISDATA];[DALFILES];[DALDATA]"
    log("CustomActionData=" + Session.Property("CustomActionData"));
    var props = Session.Property("CustomActionData").split(";");
    
    // Decode parameters
    var commonDir = props[0];
    var misdata   = props[1];
    var dalfiles  = props[2];
    var daldata   = props[3];

    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if (!fso.FolderExists(commonDir))
        fso.CreateFolder(commonDir);
    else
        log("THIS FOLDER ALREADY EXISTS: " + commonDir);

    if (!fso.FolderExists(misdata))
        fso.CreateFolder(misdata);
    else
        log("THIS FOLDER ALREADY EXISTS: " + misdata);

    if (!fso.FolderExists(dalfiles))
        fso.CreateFolder(dalfiles);
    else
        log("THIS FOLDER ALREADY EXISTS: " + dalfiles);

    if (!fso.FolderExists(daldata))
        fso.CreateFolder(daldata);
    else
        log("THIS FOLDER ALREADY EXISTS: " + daldata);      
    
    return 1;
  } catch (e) {
    log("An error occurred: " + e.description);
    return 0;
  }
}

function log(msg) {
  var msiMessageTypeInfo = 0x04000000;
  var msgrec = Installer.CreateRecord(1);
  msgrec.StringData(0) = "Log: [1]";
  msgrec.StringData(1) = msg;
  Session.Message(msiMessageTypeInfo, msgrec);
}

function Uninstall() {
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var shell = new ActiveXObject("WScript.Shell");
        var SystemEnvVars = shell.Environment("SYSTEM");

        var reporterParFile = SystemEnvVars("CL_WORKDIR_PATH") + "\\config\\ses_reporter.par";

        // remove reporter file from classlib
        if (fso.FileExists(reporterParFile)) {
            fso.DeleteFile(reporterParFile, true);
        }

        // remove envvars modified in CustomActions
        RemoveEnvVar("SES_ROOT");
        RemoveEnvVar("SES_WORKDIR_PATH");
    }
    catch (e) {
        log("Uninstall() exception caught: " + e.message);
    }
}


function RestartClasslib() {
  try {
    var shell = new ActiveXObject("WScript.Shell");
    var cmd = "";

    // requires admin priviledges, e.g. CustomAction with impersonate=no
    cmd = "cmd /C \"\"%CL_ROOT_PATH%\"\\bin\\classlib_service_restart.bat\"";
    shell.run(cmd, 7);
  }
  catch (e) {
    log("RestartClasslib() exception caught: " + e.message);
  }
}

function RemoveEnvVar(envvar) {
    try {
        var shell = new ActiveXObject("WScript.Shell");
        var SystemEnvVars = shell.Environment("SYSTEM");
        SystemEnvVars.Remove(envvar);
    }
    catch (e) { }
}


function NotUsedYetgenerateMisFolders() {
    try {
        // See also Product.wxs, CustomAction prepareGenerateMisFolders.
        // The value of the "CustomActionData" property is:
        // "[COMMON];[MISDATA];[DALFILES];[DALDATA]"
        log("CustomActionData=" + Session.Property("CustomActionData"));
        var props = Session.Property("CustomActionData").split(";");

        // declaration: change permissions for commonDir
        var shell = new ActiveXObject("WScript.Shell");
        var SystemEnvVars = shell.Environment("SYSTEM");
        var cmd = "";

        // Decode parameters
        var commonDir = props[0];
        var misdata = props[1];
        var dalfiles = props[2];
        var daldata = props[3];

        var fso = new ActiveXObject("Scripting.FileSystemObject");
        if (!fso.FolderExists(commonDir)) {
            fso.CreateFolder(commonDir);

            // declaration: change permissions for commonDir     
            cmd = "cmd /C \"icacls " + commonDir + " /T /grant Users:(OI)(CI)F\"";
            shell.run(cmd, 7);
        }
        else
            log("THIS FOLDER ALREADY EXISTS: " + commonDir);

        if (!fso.FolderExists(misdata))
            fso.CreateFolder(misdata);
        else
            log("THIS FOLDER ALREADY EXISTS: " + misdata);

        if (!fso.FolderExists(dalfiles))
            fso.CreateFolder(dalfiles);
        else
            log("THIS FOLDER ALREADY EXISTS: " + dalfiles);

        if (!fso.FolderExists(daldata))
            fso.CreateFolder(daldata);
        else
            log("THIS FOLDER ALREADY EXISTS: " + daldata);

        return 1;
    } catch (e) {
        log("An error occurred: " + e.description);
        return 0;
    }
}
