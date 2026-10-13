param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$AudioPath
)

$ErrorActionPreference = 'Stop'
$script:playbackError = $null
$script:player = $null

try {
    Add-Type -AssemblyName PresentationCore
    $resolvedAudioPath = (Resolve-Path -LiteralPath $AudioPath -ErrorAction Stop).Path
    $script:player = New-Object System.Windows.Media.MediaPlayer
    $script:player.Volume = 1.0
    $script:player.add_MediaOpened({
        $script:player.Play()
    })
    $script:player.add_MediaEnded({
        $script:player.Close()
        [System.Windows.Threading.Dispatcher]::CurrentDispatcher.BeginInvokeShutdown(
            [System.Windows.Threading.DispatcherPriority]::Background
        )
    })
    $script:player.add_MediaFailed({
        $script:playbackError = $_.ErrorException.Message
        [System.Windows.Threading.Dispatcher]::CurrentDispatcher.BeginInvokeShutdown(
            [System.Windows.Threading.DispatcherPriority]::Background
        )
    })
    $script:player.Open([Uri]::new($resolvedAudioPath))
    [System.Windows.Threading.Dispatcher]::Run()

    if ($script:playbackError) {
        throw $script:playbackError
    }
}
catch {
    [Console]::Error.WriteLine("[ERROR] Gagal memutar file audio '$AudioPath': $($_.Exception.Message)")
    exit 1
}
finally {
    if ($script:player) {
        $script:player.Close()
    }
}
