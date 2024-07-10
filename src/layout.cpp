#include "layout.hpp"
#include "style.hpp"
#include "lib/assets.hpp"

OldSchool::OldSchool()
{
  name = "old_school";
  type = Crails::Cms::ComponentLayoutType;
  component_layout_name = "OldSchoolLayoutEditor";
  stylesheets.push_back(OldSchoolAssets::layout_css);
  editor_stylesheets.push_back(OldSchoolAssets::admin_css);
  editor_javascripts.push_back(OldSchoolAssets::editor_js);
  variables.push_back(Crails::Cms::LayoutVariable("sidebar-header", "html", ""));
  variables.push_back(Crails::Cms::LayoutVariable("main-background", "color", "#FCCFBB"));
  variables.push_back(Crails::Cms::LayoutVariable("title-color", "color", "#095530"));
  variables.push_back(Crails::Cms::LayoutVariable("text-color", "color", "#095530"));
  variables.push_back(Crails::Cms::LayoutVariable("blink-color", "color", "#FFFFFF"));
  variables.push_back(Crails::Cms::LayoutVariable("button-text-color", "color", "#22ac4d"));
  variables.push_back(Crails::Cms::LayoutVariable("alt-button-text-color", "color", "#732D00"));
  variables.push_back(Crails::Cms::LayoutVariable("alt-background", "color", "#FFFFFF"));
  variables.push_back(Crails::Cms::LayoutVariable("link-color", "color", "#0000EE"));
}

const Crails::Cms::Style& OldSchool::get_style() const
{
  static const OldSchoolStyle style;
  return style;
}
