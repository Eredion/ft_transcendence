class MuchachosController < ApplicationController
  before_action :set_muchacho, only: [:show, :edit, :update, :destroy]

  # GET /muchachos
  # GET /muchachos.json
  def index
    @muchachos = Muchacho.all
  end

  # GET /muchachos/1
  # GET /muchachos/1.json
  def show
  end

  # GET /muchachos/new
  def new
    @muchacho = Muchacho.new
  end

  # GET /muchachos/1/edit
  def edit
  end

  # POST /muchachos
  # POST /muchachos.json
  def create
    @muchacho = Muchacho.new(muchacho_params)

    respond_to do |format|
      if @muchacho.save
        format.html { redirect_to @muchacho, notice: 'Muchacho was successfully created.' }
        format.json { render :show, status: :created, location: @muchacho }
      else
        format.html { render :new }
        format.json { render json: @muchacho.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /muchachos/1
  # PATCH/PUT /muchachos/1.json
  def update
    respond_to do |format|
      if @muchacho.update(muchacho_params)
        format.html { redirect_to @muchacho, notice: 'Muchacho was successfully updated.' }
        format.json { render :show, status: :ok, location: @muchacho }
      else
        format.html { render :edit }
        format.json { render json: @muchacho.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /muchachos/1
  # DELETE /muchachos/1.json
  def destroy
    @muchacho.destroy
    respond_to do |format|
      format.html { redirect_to muchachos_url, notice: 'Muchacho was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_muchacho
      @muchacho = Muchacho.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def muchacho_params
      params.require(:muchacho).permit(:nick, :wins, :defeats, :winrate, :guild)
    end
end
