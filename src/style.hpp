#pragma once
#include <crails/cms/views/style.hpp>

class OldSchoolStyle : public Crails::Cms::Style
{
  SINGLETON_IMPLEMENTATION(OldSchoolStyle, Crails::Cms::Style)
public:
  std::string render_menu(const Crails::Cms::Menu&, Crails::Cms::Menu::Direction, const Crails::Cms::ClassList&, const std::string& header) const override;

  Crails::Cms::ClassList menu_item_classes() const override { return {}; }
  Crails::Cms::ClassList menu_link_classes() const override { return button_classes(); }
  Crails::Cms::ClassList menu_children_classes() const override { return {"sub-menu"}; }
  Crails::Cms::ClassList button_classes() const override { return {"old-btn"}; }

  std::string section(int index, const std::map<std::string,std::string>&, std::function<std::string()>) const override;
};
