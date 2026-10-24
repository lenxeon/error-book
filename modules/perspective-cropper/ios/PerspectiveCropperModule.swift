import CoreGraphics
import CoreImage
import ExpoModulesCore
import Foundation
import UIKit

public final class PerspectiveCropperModule: Module {
  public func definition() -> ModuleDefinition {
    Name("PerspectiveCropper")

    AsyncFunction("perspectiveCrop") { (uri: String, coordinates: [Double]) throws -> String in
      guard coordinates.count == 8 else {
        throw NSError(domain: "PerspectiveCropper", code: 1, userInfo: [NSLocalizedDescriptionKey: "裁剪范围无效，请重新调整四角。"])
      }
      guard let url = URL(string: uri), url.isFileURL,
            let image = CIImage(contentsOf: url, options: [.applyOrientationProperty: true]) else {
        throw NSError(domain: "PerspectiveCropper", code: 2, userInfo: [NSLocalizedDescriptionKey: "无法读取照片，请重新选择。"])
      }

      let extent = image.extent
      func corner(_ index: Int) -> CIVector {
        let x = extent.minX + coordinates[index] * extent.width
        let y = extent.maxY - coordinates[index + 1] * extent.height
        return CIVector(x: x, y: y)
      }

      guard let filter = CIFilter(name: "CIPerspectiveCorrection") else {
        throw NSError(domain: "PerspectiveCropper", code: 3, userInfo: [NSLocalizedDescriptionKey: "当前设备不支持照片校正。"])
      }
      filter.setValue(image, forKey: kCIInputImageKey)
      filter.setValue(corner(0), forKey: "inputTopLeft")
      filter.setValue(corner(2), forKey: "inputTopRight")
      filter.setValue(corner(4), forKey: "inputBottomRight")
      filter.setValue(corner(6), forKey: "inputBottomLeft")

      guard let output = filter.outputImage else {
        throw NSError(domain: "PerspectiveCropper", code: 4, userInfo: [NSLocalizedDescriptionKey: "透视校正失败，请调整裁剪范围后重试。"])
      }
      let outputImage = output.cropped(to: output.extent.integral)
      let context = CIContext(options: [.useSoftwareRenderer: false])
      guard let cgImage = context.createCGImage(outputImage, from: outputImage.extent),
            let data = UIImage(cgImage: cgImage).jpegData(compressionQuality: 0.94) else {
        throw NSError(domain: "PerspectiveCropper", code: 5, userInfo: [NSLocalizedDescriptionKey: "无法生成裁剪后的照片。"])
      }

      let outputURL = FileManager.default.temporaryDirectory.appendingPathComponent("perspective-\(UUID().uuidString).jpg")
      try data.write(to: outputURL, options: .atomic)
      return outputURL.absoluteString
    }
  }
}
