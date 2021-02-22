class Request < ApplicationRecord
    belongs_to :requestor, :polymorphic => true
    belongs_to :receiver, :polymorphic => true
    validates :status, inclusion: %w(pending accepted denied)
    after_commit :check_request, on: :update

    def check_request
        # users are added to each other's friends list
        if self.status == 'accepted'
            if self.requestor_type == "User"
                user = User.find_by(id: self.requestor_id)
                if !user.friends.include?(self.receiver_id)
                    user.friends.push(self.receiver_id)
                    user.save
                    user.send_notification('update_friends')
                end

                user = User.find_by(id: self.receiver_id)
                if !user.friends.include?(self.requestor_id)
                    user.friends.push(self.requestor_id)
                    user.save
                end
            end
        # delete the current record ?
        elsif self.status == 'denied'
            self.class.delete(self.id)
        end
    end
end
