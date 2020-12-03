class User < ApplicationRecord

  devise :omniauthable, omniauth_providers: [:marvin]
  
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.auth_id = auth.uid
      user.email = auth.info.email
      user.nickname = auth.info.nickname
    end
  end
end
