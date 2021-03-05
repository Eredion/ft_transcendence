import consumer from "./consumer"
import Helper from "../packs/Helper"

let channelSubscription = {
    joinChannel(channelname) {

        let cable = consumer.subscriptions.create({
            channel: "ChannelMessagesChannel",
            name: channelname,
        }, {
            connected() {
                // Called when the subscription is ready for use on the server
            },

            disconnected() {
                // Called when the subscription has been terminated by the server
            },

            received(data) {
                if (Helper.data.blockedUsers.includes(data.user_id) === true)
                    return;
                if ($('#channel-name-title').text() === data.channelname) {
                    $('#channel_view').append(`<div class="channel_message bg-light p-2">
                <div class="message_author d-inline text-primary">
                <span class="text-dark">${data.guild ? '(' + data.guild.anagram + ')' : '' }</span>
                <a >${data.author} :</a></div>
                <div class="message_content d-inline text-dark"> ${data.content}</div>
                </div>`);
                    $('#input-msg-channel-form').focus();
                    let chatHistory = $('#channel_view');
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                } else {
                    $(`a[href="#channels/${data.channelname}"]`).addClass('border border-success');
                }
                // Called when there's incoming data on the websocket for this channel
            }
        });

        cable.channelname = channelname;
        return cable;
    },
}

export default channelSubscription;