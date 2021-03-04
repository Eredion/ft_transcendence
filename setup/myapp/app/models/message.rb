class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chat, optional: true
  belongs_to :channel, optional: true
  validates :content, format: { with: /\A[ !¡?_,.ñáéóíúa-zA-Z]+\z/,
    message: "safe symbols" }
end
