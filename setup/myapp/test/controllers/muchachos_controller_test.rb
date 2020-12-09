require 'test_helper'

class MuchachosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @muchacho = muchachos(:one)
  end

  test "should get index" do
    get muchachos_url
    assert_response :success
  end

  test "should get new" do
    get new_muchacho_url
    assert_response :success
  end

  test "should create muchacho" do
    assert_difference('Muchacho.count') do
      post muchachos_url, params: { muchacho: { defeats: @muchacho.defeats, guild: @muchacho.guild, nick: @muchacho.nick, winrate: @muchacho.winrate, wins: @muchacho.wins } }
    end

    assert_redirected_to muchacho_url(Muchacho.last)
  end

  test "should show muchacho" do
    get muchacho_url(@muchacho)
    assert_response :success
  end

  test "should get edit" do
    get edit_muchacho_url(@muchacho)
    assert_response :success
  end

  test "should update muchacho" do
    patch muchacho_url(@muchacho), params: { muchacho: { defeats: @muchacho.defeats, guild: @muchacho.guild, nick: @muchacho.nick, winrate: @muchacho.winrate, wins: @muchacho.wins } }
    assert_redirected_to muchacho_url(@muchacho)
  end

  test "should destroy muchacho" do
    assert_difference('Muchacho.count', -1) do
      delete muchacho_url(@muchacho)
    end

    assert_redirected_to muchachos_url
  end
end
