[emscripten xash3d fork](https://github.com/ololoken/xash3d-fwgs)
```
emconfigure ./waf configure --emscripten && emmake ./waf build && emmake ./waf install --destdir ./out
```

[emscripten cs16-client](https://github.com/ololoken/cs16-client)
```
cd /path/to/fork
mkdir build 
cd build
emcmake cmake ../ -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=../out && emmake make all install
```

