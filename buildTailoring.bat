@echo off
setlocal

:build
SET BUILDYEAR=%DATE:~6,4%

if exist ".\setup\sesadminversioninfo.wxi" (
  attrib -r ".\setup\sesadminversioninfo.wxi"
)

if not exist ".\setup\sesadminversioninfo.wxi" (
  echo Generating .\setup\sesadminversioninfo.wxi
  echo ^<?xml version="1.0" encoding="Windows-1252"?^>>.\setup\sesadminversioninfo.wxi"
  echo ^<Include^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<!-- define voltdelta product variables:  --^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define BUILDID="%BUILD_ID%"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define companyName="Volt Delta International GmbH"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define companyNameShort="Volt Delta"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define vdiInstallDir="Volt Delta"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define ProductName="SesAdmin"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define ProductFullName="SesAdmin Tailoring"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define ProductVersion="%BUILD_ID%"?^>>>.\setup\sesadminversioninfo.wxi"
  echo   ^<?define TailorVersion="%BUILD_ID%"?^>>>.\setup\sesadminversioninfo.wxi"
  echo ^</Include^>>>.\setup\sesadminversioninfo.wxi"
)


rem Visual Studio environment
if "%VSVER%"=="" set VSVER=100
call set VSTOOLS=%%VS%VSVER%COMNTOOLS%%
if exist "%VSTOOLS%vsvars32.bat" (
    @call "%VSTOOLS%vsvars32.bat"
    goto :vsok
)
echo "Visual Studio ver %VSVER% not found!" 1>&2
exit /b -1
:vsok
set VisualStd=%VSTOOLS%..\..

if not "%1"=="" (
    set workspace=%1
    goto :execute
)
set "workspace=%cd%"
:execute


set PATH=%PATH%;C:\Program Files (x86)\Microsoft SDKs\Windows\v7.0A\Bin
"devenv.com" /Rebuild "Release|x86" SesAdminTailoring.sln 

goto end

:error
echo.
echo Error: failed to build project
echo.
goto end

:end
