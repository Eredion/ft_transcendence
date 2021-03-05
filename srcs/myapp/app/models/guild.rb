class Guild < ApplicationRecord
    validates :title, :anagram, presence: true, uniqueness: true
    belongs_to :owner, class_name: "User"
    mount_uploader :guild_avatar, GuildAvatarUploader
    has_one :chat
    has_many :requests, :as => :requestor
    has_many :requests, :as => :receiver
end
