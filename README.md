A javascript fighting game that will feature my friends.

To-Do:
~ add an airdash mechanic, in air only same key as roll/dodge
~ a roll or dodge option that rapidly shifts player, likely with iFrames, on ground only, same key as air dash
~ add multiple attacks, characters with different properties
~ add a character select menu and a way to reset the game
~ add a best of x feature counting the cumulative round wins in a 3/5 format
~ add blocking and grabbing
~ win and loss screens with voice acted lines and attacks/hits
~ add Oki?
~ add scrolling for a brief interval for corners.
~ revamp lastKey system to squash bug report: 1
Bug Report:

1~holding "a", then "d", then jumping and releasing "d" will cease your horizontal movement rather than return to "a" because "a" will no longer be last key, same movement bug applies with attacks

2~healthbar currently overlaps player models, should be players overlapping health.

3~holding down attack pulls out an attack every so many ms, unless the opponent presses a key?

4~small delay on attack timing (factoring knockback) if user is spamming the attack button during their hitstun
