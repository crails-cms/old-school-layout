#include "layout.hpp"
#include "autogen/assets.hpp"
#include "autogen/renderers/old_school_html_renderer.hpp"

extern "C"
{
  Crails::BuiltinAssets* get_assets()
  {
    static OldSchoolAssets assets;
    return &assets;
  }

  Crails::Renderer* get_html_renderer()
  {
    static OldSchoolHtmlRenderer renderer;
    return &renderer;
  }

  Crails::Cms::Layout* create_layout()
  {
    return new OldSchool();
  }
}
