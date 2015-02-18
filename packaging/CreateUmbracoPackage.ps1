function ZipFiles($zipfilename, $sourcedir)
{
    Add-Type -Assembly System.IO.Compression.FileSystem
    $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
    [System.IO.Compression.ZipFile]::CreateFromDirectory($sourcedir, $zipfilename, $compressionLevel, $false)
}

function get-assembly-version() {
    param([string] $file)
    
    $version = [System.Reflection.AssemblyName]::GetAssemblyName($file).Version;
    
    #format the version and output it...
    $version.ToString()
}

$packageGuid = [guid]::NewGuid().ToString("D")
$currentFolder = (Get-Item $MyInvocation.MyCommand.Definition).Directory
$manifestFile = (Join-Path $currentFolder "package.xml")
$dllFile = (Join-Path $currentFolder.Parent.FullName "src\TaxonomyPicker\bin\Release\TaxonomyPicker.dll")
$releaseFolder = (Join-Path $currentFolder "Release")
$packFolder = (Join-Path $releaseFolder $packageGuid)

#Check requisites
if(!(Test-Path $dllFile)) 
{ 
    Write-Host "TaxonomyPicker.dll not found." -ForegroundColor Red
    Write-Host $dllFile -ForegroundColor Red
    Exit
}

$dllVersion = (get-assembly-version $dllFile)
$outFile = (Join-Path $releaseFolder ("TaxonomyPicker_" + $dllVersion + ".zip"))

#Create tmp folder
New-Item $packFolder -ItemType directory

#Copy manifest file
$manifestXml = [xml](Get-Content $manifestFile)
$manifestXml.umbPackage.info.package.version = $dllVersion
$manifestOutput = (Join-Path $packFolder "package.xml")
$manifestXml.Save($manifestOutput)

#Copy dll
Copy-Item $dllFile $packFolder 

#Zip folder as package
ZipFiles $outFile $packFolder


