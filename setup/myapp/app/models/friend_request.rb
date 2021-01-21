class FriendRequest < ApplicationRecord
    belongs_to :requestor, class_name: :User
    belongs_to :receiver, class_name: :User
    validates :status, inclusion: %w(pending accepted denied)
    after_commit :check_friend_request, on: :update

    def check_friend_request
        # users are added to each other's friends list
        if self.status == 'accepted'
            user = User.find_by(id: self.requestor_id)
            if !user.friends.include?(self.receiver_id)
                user.friends.push(self.receiver_id)
                user.save
            end

            user = User.find_by(id: self.receiver_id)
            if !user.friends.include?(self.requestor_id)
                user.friends.push(self.requestor_id)
                user.save
            end
        # delete the current record ?
        elsif self.status == 'denied'
            self.class.delete(self.id)
        end
    end
end
