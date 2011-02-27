@echo off

REM Settings
set version=1
set server=http://static.zencodez.net/
set libpath=../test/libs/

echo  **************************************
echo  * Update script made by Han Lin Yap  *
echo  * Version %version% - 2011-02-27     *
echo  **************************************
echo.

REM Get versions
wget.exe %server%versions%version%.txt /output versions.txt
echo.

REM Read rows versions.txt
for /f %%f in (versions.txt) do (
	REM Split : in versions.txt
	for /f "tokens=1,2,3 delims=: " %%a in ("%%f") do (
		if exist "options.tmp" (
			del options.tmp
		)
		REM Read rows options.txt
		for /f %%o in (options.txt) do (
			REM Split : in options.txt
			for /f "tokens=1,2,3 delims=: " %%p in ("%%o") do (
				REM Do first part in option and version match?
				if %%p == %%a (
					if not exist "%libpath%%%c" (
						REM Update script
						if not "%%r" == "" (
							wget.exe %server%js/%%c /output %libpath%%%r
						) else (
							wget.exe %server%js/%%c /output %libpath%%%c
						)
						echo %%a %%b has been updated
					) else (
						REM Do second part in option and version NOT match?
						REM Update script
						if not "%%r" == "" (
							wget.exe %server%js/%%c /output %libpath%%%r
						) else (
							wget.exe %server%js/%%c /output %libpath%%%c
						)
					)
					if not "%%r" == "" (
						echo %%a:%%b:%%r>> options.tmp
					) else (
						echo %%a:%%b>> options.tmp
					)
				) else (
					echo %%o>> options.tmp
				)
			)
		)
		move options.tmp options.txt > nul
	)
)


echo.
pause