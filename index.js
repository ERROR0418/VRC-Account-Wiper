const vrchat = require("vrchat");

var launchArgs = process.argv.slice(2);

let configuration;

if(launchArgs[0]=="token"){
    configuration = new vrchat.Configuration({
        accessToken: launchArgs[1],
    });
}else{
    configuration = new vrchat.Configuration({
        username: launchArgs[0],
        password: launchArgs[1]
    });
}



const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
const FriendsApi = new vrchat.FriendsApi(configuration);
const FavoritesApi = new vrchat.FavoritesApi(configuration);
const UserApi = new vrchat.UsersApi(configuration);
const AvatarApi = new vrchat.AvatarsApi(configuration);
const WorldsApi = new vrchat.WorldsApi(configuration);
const ModerationApi = new vrchat.PlayermoderationApi(configuration);
const FilesApi = new vrchat.FilesApi(configuration);

AuthenticationApi.getCurrentUser().then(resp => {
    const currentUser = resp.data;

    console.log(`Logged in as: ${currentUser.displayName}`);

    console.log("Wiping friends!")
    currentUser.friends.forEach(friend=>{
        FriendsApi.unfriend(friend);
    });

    console.log("Wiping all moderations against users!")
    ModerationApi.clearAllPlayerModerations()

    console.log("Wiping 100 main favorites!")
    AvatarApi.getFavoritedAvatars("", "random", 100).then(avatars=>{
        avatars.data.forEach(avatar=>{
            FavoritesApi.removeFavorite(avatar.id)
        })
    }).catch(console.error)

});
