
import AVFoundation
import AppKit
import Foundation

let src = URL(fileURLWithPath: CommandLine.arguments[1])
let outDir = CommandLine.arguments[2]
let times = CommandLine.arguments[3].split(separator: ",").compactMap { Double($0) }
let asset = AVURLAsset(url: src)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.maximumSize = CGSize(width: 1440, height: 810)
print("duration", CMTimeGetSeconds(asset.duration))
for t in times {
    let time = CMTime(seconds: t, preferredTimescale: 600)
    do {
        let cg = try gen.copyCGImage(at: time, actualTime: nil)
        let img = NSImage(cgImage: cg, size: NSSize(width: cg.width, height: cg.height))
        let tiff = img.tiffRepresentation!
        let rep = NSBitmapImageRep(data: tiff)!
        let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!
        let name = String(format: "t%05.1f.jpg", t)
        try data.write(to: URL(fileURLWithPath: outDir + "/" + name))
        print("ok", name)
    } catch {
        print("fail", t, error)
    }
}
