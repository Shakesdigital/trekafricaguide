$dir='C:\Users\FOSCOD\.codex\artifacts\trek-photo-site\public\images\editorial\plan-first-kenya-safari-mara'
$files=[ordered]@{
 'mara-river-wildebeest-jump-2020.jpg'='https://upload.wikimedia.org/wikipedia/commons/7/73/Wildebeest_Jumping_Into_the_Mara_River.jpg'
 'mara-cheetah-tour-vehicle-2018.jpg'='https://upload.wikimedia.org/wikipedia/commons/b/bd/Cheetah%2C_Maasai_Mara.jpg'
 'mara-safari-vehicle-acacia-2025.jpg'='https://upload.wikimedia.org/wikipedia/commons/c/c2/Safari_vehicle_parked_under_acacia_tree_on_savanna%2C_Maasai_Mara%2C_Kenya.jpg'
 'olare-motorogi-hyena-2019.jpg'='https://upload.wikimedia.org/wikipedia/commons/7/7e/Spotted_hyena_-_Olare_Motorogi_Conservancy_%2849549231647%29.jpg'
 'mara-airstrip-lapas-2022.jpg'='https://upload.wikimedia.org/wikipedia/commons/b/be/Masai_Mara_National_Reserve_-_52496971647.jpg'
 'mara-wildebeest-hillside-sand-river-2025.jpg'='https://upload.wikimedia.org/wikipedia/commons/7/78/Wildebeest_herd_on_hillside%2C_Maasai_Mara%2C_Kenya.jpg'
}
[net.servicepointmanager]::SecurityProtocol=[net.securityprotocoltype]::Tls12
$h=@{ 'User-Agent'='TrekAfricaGuideEditorial/1.0 (contact: fsddanmugisa@gmail.com)' }
foreach($k in $files.Keys){
  $out="$dir\$k"
  $done = Test-Path $out
  if(-not $done){
    $url=$files[$k]
    for($i=1;$i -le 15;$i++){
      try { Invoke-WebRequest $url -OutFile $out -Headers $h -TimeoutSec 120; Write-Output "OK $k attempt$i"; break }
      catch { Write-Output "429 $k attempt$i"; Start-Sleep -Seconds 75 }
    }
    Start-Sleep -Seconds 20
  }
}
Write-Output '---'
Get-ChildItem $dir -Filter *.jpg | ForEach-Object { "{0} {1}" -f $_.Name, (Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower() }
