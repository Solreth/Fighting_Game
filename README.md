A javascript fighting game that will feature my friends.

planned additions for the future are :
~ add an airdash mechanic, in air only same key as roll/dodge
~ a roll or dodge option that rapidly shifts player, likely with iFrames, on ground only, same key as air dash
~ add multiple attacks, characters with different properties
~ add a character select menu and a way to reset the game
~ add a best of x feature counting the cumulative round wins in a 3/5 format
~ add blocking and grabbing
~ win and loss screens with voice acted lines and attacks/hits
~ add scrolling for a brief interval for corners.
~ eventually allow peer to peer play rather over the internet
~ revamp lastKey system to squash bug report: 1
and much more.

Bug Report:

1~holding "a", then "d", then jumping and releasing "d" will cease your horizontal movement rather than return to "a" because "a" will no longer be last key, same movement bug applies with attacks
2~holding down attack pulls out an attack every so many ms, unless the opponent presses a key?
3~ can jump after initiating attack before it ends. (half bug / half feature)
4~ jumping-cancelling the killing blow allows you to hold an animation in place, or holding forward after a killing attack
5~ Caps lock disables player 1 movement, must make switch case case insensitive.
