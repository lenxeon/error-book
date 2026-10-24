Pod::Spec.new do |s|
  s.name           = 'PerspectiveCropper'
  s.version        = '1.0.0'
  s.summary        = 'Perspective crop support for photographed exercises.'
  s.description    = 'Corrects a photographed exercise to a rectangular image using Core Image.'
  s.license        = { :type => 'MIT' }
  s.author         = 'Maisen'
  s.homepage       = 'https://github.com/lenxeon/error-book'
  s.source         = { :git => 'https://github.com/lenxeon/error-book.git' }
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,mm,swift}'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
