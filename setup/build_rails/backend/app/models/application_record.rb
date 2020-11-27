class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  ActiveRecord::Base.include_root_in_json = false
end
