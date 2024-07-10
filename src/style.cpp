#include "style.hpp"
#include <crails/html_template.hpp>

using namespace std;
using namespace Crails;

string OldSchoolStyle::section(int, const map<string,string>& attrs_base, function<string()> yield) const
{
  map<string,string> attrs(attrs_base);

  if (attrs.find("class") != attrs.end())
    attrs["class"] = attrs_base.at("class") + " post";
  else
    attrs["class"] = "post";
  return HtmlTemplate::tag("div", attrs, yield);
}

static string render_menu_list(const Cms::Style& style, Data data);

static string render_menu_item(const Cms::Style& style, Data item)
{
  Data children = item["children"];
  bool has_children = children.exists();

  return HtmlTemplate::tag("li", {{"class",style.menu_item_classes()}}, [&]() -> string
  {
    ostringstream html;

    html << HtmlTemplate::tag("a", {
      {"href", item["href"].as<string>()},
      {"class", style.menu_link_classes()},
      {"target", item["target"].as<string>()}
    }, [item]() -> string { return item["text"]; });
    if (has_children)
    {
      html << HtmlTemplate::tag("ul", {{"class",style.menu_children_classes()}}, [&]() -> string
      {
        return render_menu_list(style, children);
      });
    }
    return html.str();
  });
}

static string render_menu_list(const Cms::Style& style, Data data)
{
  ostringstream html;

  for (Data item : data)
    html << render_menu_item(style, item);
  return html.str();
}

pair<string_view, string_view> get_menu_custom_content(const string_view custom_content)
{
  string_view split_pattern("<!-- menu -->");
  string_view header(custom_content);
  string_view footer;
  size_t split_position = custom_content.find(split_pattern);

  if (split_position != string::npos)
  {
    header = custom_content.substr(0, split_position);
    footer = custom_content.substr(split_position + split_pattern.length());
  }
  return {header, footer};
}

string OldSchoolStyle::render_menu(const Crails::Cms::Menu& menu, Crails::Cms::Menu::Direction, const Crails::Cms::ClassList& classes, const string& custom_content) const
{
  pair<string_view, string_view> parts = get_menu_custom_content(string_view(custom_content));

  return HtmlTemplate::tag("div", {
    {"class", classes + "menu"}
  }, [&]() -> string
  {
    string html = HtmlTemplate::tag("div", {{"class", "menu-main-menu-container"}}, [&]() -> string
    {
      return HtmlTemplate::tag("ul", {{"id", "sidebar_menu"},{"class","menu"}}, [&]() -> string
      {
        return render_menu_list(*this, menu.get_data());
      });
    });

    if (parts.first.length())
      html = HtmlTemplate::tag("center", [parts]() -> string { return string(parts.first); }) + html;
    if (parts.second.length())
      html = html + HtmlTemplate::tag("center", [parts]() -> string { return string(parts.second); });
    return html;
  });
}
