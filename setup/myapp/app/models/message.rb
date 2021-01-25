class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chat, optional: true
  belongs_to :channel, optional: true
end
