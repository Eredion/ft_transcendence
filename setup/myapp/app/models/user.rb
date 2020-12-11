class User < ApplicationRecord

  belongs_to :guild, optional: true
  devise :omniauthable, omniauth_providers: [:marvin]
  has_secure_password :validations => false #this affects devise authentication because no password is provided
  validates :email, :nickname, presence: true, uniqueness: true
  
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.nickname = auth.info.nickname
    end
  end
end
