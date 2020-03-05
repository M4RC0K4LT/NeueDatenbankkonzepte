/** 
 * Function to request Express Backend and return JSON - Send existing userdata -> Used on login
 * @returns {JSON} Userdata with AuthToken.
 */
export default function getFriends(){

    return (
        fetch(window.$apiroute + "/user/getfriends/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Friends: " + error.message) + '}'))
    )
}