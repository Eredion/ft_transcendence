class ApplicationController < ActionController::Base
    rescue_from ActiveRecord::RecordNotFound, :with => :render_404

    def new_session_path(scope)
        new_user_session_path
    end

    def render_404
        return render json: {"error": "not found"}, :status => 404
    end
end
