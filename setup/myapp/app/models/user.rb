class User < ApplicationRecord
  devise :two_factor_authenticatable,
         :otp_secret_encryption_key => ENV['2FA_KEY']
  has_many :messages
  has_many :channels
  has_many :chats
  devise :omniauthable, omniauth_providers: [:marvin]
  validates :email, :nickname, presence: true, uniqueness: true
  validates :nickname, length: {maximum: 12}
  mount_uploader :avatar, AvatarUploader
  has_many :requests_as_requestor, :as => :requestor, :class_name => 'Request'
  has_many :requests_as_receiver, :as => :receiver, :class_name => 'Request'
  has_one :matchmaking, dependent: :destroy
  has_many :matches_as_left_player, :class_name => 'Match', :foreign_key => 'left_player_id'
  has_many :matches_as_right_player, :class_name => 'Match', :foreign_key => 'right_player_id'
  has_many :matches_as_winner, :class_name => 'Match', :foreign_key => 'winner_id'
  has_many :matches_as_loser, :class_name => 'Match', :foreign_key => 'loser_id'
  has_one :guild, class_name: "Guild"

  def self.from_omniauth(auth)
    first_login = false
    user = where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.nickname = auth.info.nickname
      first_login = true
    end
    return user, first_login
  end

  def send_request(action, type = nil, requestor = nil, content = nil)
    ActionCable.server.broadcast( "notification_#{self.id}", {
      action: action,
      type: type,
      data: {
          :id => content.id,
          :requestor => content.requestor,
          :receiver => content.receiver,
          :category => content.category
      },
      from: requestor
    })
  end

  def send_notification(action, type = nil, requestor = nil, content = nil)
    ActionCable.server.broadcast( "notification_#{self.id}", {
      action: action,
      type: type,
      data: content,
      from: requestor
    })
  end
end
