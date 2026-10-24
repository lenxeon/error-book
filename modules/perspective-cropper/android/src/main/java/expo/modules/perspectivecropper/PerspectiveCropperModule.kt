package expo.modules.perspectivecropper

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Matrix
import android.graphics.Paint
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream
import kotlin.math.ceil
import kotlin.math.hypot
import kotlin.math.max

class PerspectiveCropperModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PerspectiveCropper")

    AsyncFunction("perspectiveCrop") { uri: String, coordinates: List<Double> ->
      require(coordinates.size == 8) { "裁剪范围无效，请重新调整四角。" }
      val context = appContext.reactContext ?: throw IllegalStateException("无法读取应用照片存储。")
      val source = context.contentResolver.openInputStream(Uri.parse(uri)).use { stream ->
        requireNotNull(stream) { "无法读取照片，请重新选择。" }
        BitmapFactory.decodeStream(stream)
      } ?: throw IllegalArgumentException("无法读取照片，请重新选择。")

      try {
        val width = source.width
        val height = source.height
        val sourcePoints = floatArrayOf(
          (coordinates[0] * width).toFloat(), (coordinates[1] * height).toFloat(),
          (coordinates[2] * width).toFloat(), (coordinates[3] * height).toFloat(),
          (coordinates[4] * width).toFloat(), (coordinates[5] * height).toFloat(),
          (coordinates[6] * width).toFloat(), (coordinates[7] * height).toFloat()
        )

        val outputWidth = max(
          hypot((sourcePoints[2] - sourcePoints[0]).toDouble(), (sourcePoints[3] - sourcePoints[1]).toDouble()),
          hypot((sourcePoints[4] - sourcePoints[6]).toDouble(), (sourcePoints[5] - sourcePoints[7]).toDouble())
        ).let { ceil(it).toInt().coerceAtLeast(1) }
        val outputHeight = max(
          hypot((sourcePoints[6] - sourcePoints[0]).toDouble(), (sourcePoints[7] - sourcePoints[1]).toDouble()),
          hypot((sourcePoints[4] - sourcePoints[2]).toDouble(), (sourcePoints[5] - sourcePoints[3]).toDouble())
        ).let { ceil(it).toInt().coerceAtLeast(1) }
        val destinationPoints = floatArrayOf(
          0f, 0f,
          outputWidth.toFloat(), 0f,
          outputWidth.toFloat(), outputHeight.toFloat(),
          0f, outputHeight.toFloat()
        )
        val matrix = Matrix()
        require(matrix.setPolyToPoly(sourcePoints, 0, destinationPoints, 0, 4)) {
          "透视校正失败，请调整裁剪范围后重试。"
        }

        val result = Bitmap.createBitmap(outputWidth, outputHeight, Bitmap.Config.ARGB_8888)
        Canvas(result).drawBitmap(source, matrix, Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG))
        val file = File(context.cacheDir, "perspective-${System.nanoTime()}.jpg")
        FileOutputStream(file).use { output ->
          check(result.compress(Bitmap.CompressFormat.JPEG, 94, output)) { "无法生成裁剪后的照片。" }
        }
        result.recycle()
        Uri.fromFile(file).toString()
      } finally {
        source.recycle()
      }
    }
  }
}
