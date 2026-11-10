$ErrorActionPreference = 'Stop'
$dir = 'public/images/editorial/okavango-trip-planning'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$manifest = @(
    @{ f = 'The Okavango Delta from 1,200 ft.jpg'; out = 'okavango-delta-aerial-cessna-1200ft-2001.jpg' },
    @{ f = 'Cebras de Burchell (Equus quagga burchellii), vista aérea del delta del Okavango, Botsuana, 2018-08-01, DD 30.jpg'; out = 'okavango-zebra-aerial-helicopter-2018.jpg' },
    @{ f = 'Mokoro Polers in the Okavango.jpg'; out = 'okavango-mokoro-poler-2003.jpg' },
    @{ f = 'Water lilies in the Okavango Delta - Botswana - panoramio.jpg'; out = 'okavango-water-lilies-2011.jpg' },
    @{ f = 'Okavango savanna with a Red Lechwe buck.jpg'; out = 'okavango-red-lechwe-savanna-2019.jpg' },
    @{ f = 'Sunset in the Okavango Delta, Botswana.jpg'; out = 'okavango-delta-sunset-2011.jpg' }
)
foreach ($m in $manifest) {
    $encoded = [uri]::EscapeDataString($m.f)
    $url = "https://commons.wikimedia.org/w/thumb.php?f=$encoded&w=1800"
    $dest = Join-Path $dir $m.out
    & curl.exe -sS --max-time 90 -w "%{http_code} $($m.out)`n" -o $dest -A 'OpenBotEditorialRun/1.0 (trekafricaguide editorial; contact via GitHub)' $url
    Start-Sleep -Seconds 4
}
Get-ChildItem $dir | Select-Object Name, Length
