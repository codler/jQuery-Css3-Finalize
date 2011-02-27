@echo off
@setlocal

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

REM Backup options.txt
copy options.txt options.bkp /y

REM Read rows versions.txt
for /f %%f in (versions.txt) do (
	REM Split : in versions.txt
	for /f "tokens=1,2,3,4 delims=: " %%a in ("%%f") do (
		if exist "options.tmp" (
			del options.tmp
		)
		REM Read rows options.txt
		for /f %%o in (options.txt) do (
			REM Split : in options.txt
			for /f "tokens=1,2,3 delims=: " %%p in ("%%o") do (
				REM Do first part in option and version match?
				if %%p == %%b (
					if not exist "%libpath%%%d" (
						REM Update script
						if not "%%r" == "" (
							wget.exe %server%%%a/%%d /output %libpath%%%r
						) else (
							wget.exe %server%%%a/%%d /output %libpath%%%d
						)
						echo %%b %%c has been updated
						
						if "%%a" == "rar" (
							"%programfiles%/WinRAR/unrar" x -y "%libpath%%%d" "%libpath%"
							echo unpack "%libpath%%%d"
						)
					) else (
						REM Do second part in option and version NOT match?
						if not %%q == %%c (
							REM Update script
							if not "%%r" == "" (
								wget.exe %server%%%a/%%d /output %libpath%%%r
							) else (
								wget.exe %server%%%a/%%d /output %libpath%%%d
							)
							echo %%b %%c has been updated

							if "%%a" == "rar" (
								"%programfiles%/WinRAR/unrar" x -y "%libpath%%%d" "%libpath%"
								echo unpack "%libpath%%%d"
							)
						) else (
							echo %%b %%c
						)
					)
					if not "%%r" == "" (
						echo %%b:%%c:%%r>> options.tmp
					) else (
						echo %%b:%%c>> options.tmp
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
endlocal
pause