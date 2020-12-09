require "application_system_test_case"

class MuchachosTest < ApplicationSystemTestCase
  setup do
    @muchacho = muchachos(:one)
  end

  test "visiting the index" do
    visit muchachos_url
    assert_selector "h1", text: "Muchachos"
  end

  test "creating a Muchacho" do
    visit muchachos_url
    click_on "New Muchacho"

    fill_in "Defeats", with: @muchacho.defeats
    fill_in "Guild", with: @muchacho.guild
    fill_in "Nick", with: @muchacho.nick
    fill_in "Winrate", with: @muchacho.winrate
    fill_in "Wins", with: @muchacho.wins
    click_on "Create Muchacho"

    assert_text "Muchacho was successfully created"
    click_on "Back"
  end

  test "updating a Muchacho" do
    visit muchachos_url
    click_on "Edit", match: :first

    fill_in "Defeats", with: @muchacho.defeats
    fill_in "Guild", with: @muchacho.guild
    fill_in "Nick", with: @muchacho.nick
    fill_in "Winrate", with: @muchacho.winrate
    fill_in "Wins", with: @muchacho.wins
    click_on "Update Muchacho"

    assert_text "Muchacho was successfully updated"
    click_on "Back"
  end

  test "destroying a Muchacho" do
    visit muchachos_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Muchacho was successfully destroyed"
  end
end
