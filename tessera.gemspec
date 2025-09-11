# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "tessera-jekyll-theme"
  spec.version       = "0.2.0"
  spec.authors       = ["ItsZariep"]
  spec.email         = ["itszariep@disroot.org"]

  spec.summary       = "Simple jekyll theme with a grid layout"
  spec.homepage      = "https://github.com/itszariep/tessera"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_data|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.4"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-archives", "~> 2.3"
end
