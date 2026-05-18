Add-Type -AssemblyName System.Drawing
$inputPath = 'C:\Users\User\Downloads\meu_rg.jpg.jpeg'
$outputPath = 'C:\Users\User\Downloads\meu_rg_1500x1000.jpg'

$img = [System.Drawing.Image]::FromFile($inputPath)
$newImg = New-Object System.Drawing.Bitmap(1500, 1000)
$g = [System.Drawing.Graphics]::FromImage($newImg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, 1500, 1000)
$newImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$newImg.Dispose()
$img.Dispose()
Write-Host "Success: $outputPath"
