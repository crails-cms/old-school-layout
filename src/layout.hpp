#pragma once
#include <crails/cms/views/layout.hpp>

struct OldSchool : public Crails::Cms::Layout
{
  OldSchool();

  const Crails::Cms::Style& get_style() const override;
};
