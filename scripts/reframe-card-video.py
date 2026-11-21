"""Reframe the landscape Schladming master to the 9:16 card, shot by shot.

The master is 1920x1080 and the card is portrait, so a fixed centre crop
loses the play whenever it happens near an edge. These keyframes give the
centre of the action at each moment (in units of a 360px-wide contact
sheet), are interpolated per frame, smoothed within each shot but never
across a cut, and written as an ffmpeg sendcmd file:

    python3 scripts/reframe-card-video.py        # writes crop.cmd
    ffmpeg -i master.mov -vf "sendcmd=f=crop.cmd,crop=608:1080:656:0,..." ...

See "Card video" in the README for the full encode.
"""
# Keyframes: time (s) -> centre of the subject, in 360px-wide sheet units.
K = [(0.0,175),(0.5,200),(1.0,305),(1.5,305),(1.75,180),(2.0,60),(2.5,150),(3.0,235),(3.5,280),(3.6,250),(3.75,290),(3.86,200),(3.9,80),(3.94,80),
     (3.98,220),(4.3,200),(4.5,170),
     (5.0,190),(5.5,200),(6.0,235),(6.5,230),(7.0,120),(7.5,110),(8.0,160),(8.5,175),(8.6,185),(8.72,146),(8.84,112),(8.96,101),(9.08,90),(9.6,85),
     (9.64,200),(10.0,200),(10.5,230),(11.0,170),(11.5,150),(12.0,80),(12.5,110),(13.0,230),(13.5,250),(14.0,190),(14.5,235),(14.75,235),(14.9,210),(15.0,175),(15.5,145),(15.96,145),
     (16.0,260),(16.25,303),(16.6,303),(17.0,303),(17.2,280),(17.5,200),(17.6,290),(17.75,130),(17.85,250),(18.05,215),(18.25,160),(18.5,120),(19.0,180),(19.5,235),(20.4,235)]
CUTS = [3.98, 9.64, 16.0]
FPS, N, SRC_W, W = 25, 508, 1920, 608
def lin(t):
    for (a,va),(b,vb) in zip(K,K[1:]):
        if a <= t <= b: return va + (vb-va)*(t-a)/(b-a)
    return K[-1][1]
xs = [lin(i/FPS)*SRC_W/360 for i in range(N)]
# Smooth within each shot only, so a cut stays a cut.
bounds = [0]+[round(c*FPS) for c in CUTS]+[N]
out = []
R = 2
for s,e in zip(bounds,bounds[1:]):
    seg = xs[s:e]
    for i in range(len(seg)):
        lo,hi = max(0,i-R), min(len(seg),i+R+1)
        out.append(sum(seg[lo:hi])/(hi-lo))
with open('crop.cmd','w') as f:
    for i,c in enumerate(out):
        x = int(min(max(c - W/2, 0), SRC_W - W)) // 2 * 2
        f.write(f"{i/FPS:.3f} crop x {x};\n")
print(open('crop.cmd').read()[:200])
