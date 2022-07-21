# fall_girls

Lara Meister, 263235, SoSe2022, Medieninformatik, Semester 6

[Code der Endabgabe](https://github.com/larimei/fall-girls)   
[Designdokument](https://github.com/larimei/fall-girls/blob/main/AbgabeKonzeptAnfang.pdf)    
[Spiel](https://larimei.github.io/fall-girls/index.html)    



# Prima
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University
## Checklist for the final assignment
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
| Nr | Criterion       | Explanation                                                                                                              |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  0 | Units and Positions | 1 Unit = 1 meter; Avatar = ca. 1m; Runlevel width = 15 meter; survivelevel = 15 meter * 15 meter                             |
|  1 | Hierarchy         | game (levels (survive (surviveMeshes), light, surroundLight,run (runMeshes)), avatar (camera), sounds (allSounds))                                   |
|  2 | Editor            | Building the world, Rigidbodyies, Mehses, Material -> Editor (good to see immidiately how it looks); Functions like shooting, animation, scripts/function for big amount of mehses -> scripting (when dynamically added or when i needed functions which arent available in editor)                        |
|  3 | Scriptcomponents  | Rotating oles and cylinders -> useful because they can depend on different attributes                  |
|  4 | Extend            | Shootings -> Node,  CannonStateMashine -> ComponentStateMashine, some Scriptcomponents,    GameState -> Mutable                |
|  5 | Sound             | theme -> ambient music/theme, hit -> when avatar collides, jump -> for jumping, win and loose, shoot -> when cannon shoots                   |
|  6 | VUI               | VUI shows the time: Run ->  how long user needs to finish level, Survive -> how much time the user needs to survive               |
|  7 | Event-System      | standardevents -> interactiveViewportStarted, etc,, HTMLEvents -> click, a lot of triggerEvents -> reach goal, falls, for CannonStateMashine, colliderEnterEvents -> for hit sounds
|  8 | External Data     | config file for the time the user needs to survive and the speed for the avatar   |
|  9 | Light             | blue AmbientLight -> for sky, yellow directional light -> for sun                                                                    |
|  A | Physics           | Rigidbody for almost everything, forces for jump and shooting of the cannon, universaljoint for last obstacle               |
|  B | Net               | -                                                                       |
|  C | State Machines    | StateMashine for Cannon to get activated when avatar is near and to get aggressive when avatar is very near       |
|  D | Animation         | cannon is animated to swing around                   |

The criteria 0 to 9 are mandatory and yield 1 point each. Choose from A to D for additional points as noted in brackets. An aspect of your application may not fullfill multiple criteria.  
| Points | 9   | 10  | 11  | 12  |
|--------|-----|-----|-----|-----|
| Grade  | 4.0 | 3.0 | 2.0 | 1.0 |

