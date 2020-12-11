class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def index
    @user = User.search(params[:search])
  end

  def show
  end

  def edit
  end

  def update
    if @user.update(user_params)
      flash[:success] = "User updapted"
      redirect_to listing_path(@listing)
    else
      render 'edit'
end
