// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (Shell.fileExists("temp/build.done.flag")) {
	return;
};

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.mkdirRecursivelyIfNotExists("temp/cmake");

if (!Shell.fileExists("temp/build.config.flag")) {
	Shell.setenv("CC", "cl.exe");
	Shell.setenv("CXX", "cl.exe");
	Shell.setenv("ASM_MASM", "ml64.exe");

	if (Fabricare.isStatic()) {
		Shell.copyFile("fabricare/source/exports.h","source/Include/exports.h");
		Shell.copyFile("fabricare/source/sysmodule.c","source/Python/sysmodule.c");
	};

	cmdConfig = "cmake";
	cmdConfig += " ../../source";
	cmdConfig += " -G \"Ninja\"";
	cmdConfig += " -DCMAKE_ASM_MASM_COMPILE_OBJECT=ml64.exe";

	if (Fabricare.isDynamic()) {

		cmdConfig += " -DBUILD_SHARED_LIBS=ON";
		cmdConfig += " -DWIN32_MT_BUILD=OFF";
		cmdConfig += " -DBUILD_LIBPYTHON_SHARED=ON";
		cmdConfig += " -DCMAKE_MSVC_RUNTIME_LIBRARY=MultiThreaded";
		cmdConfig += " -DCMAKE_CXX_FLAGS_RELEASE=\"/MD /O2 /Ob2 /DNDEBUG\"";
		cmdConfig += " -DCMAKE_C_FLAGS_RELEASE=\"/MD /O2 /Ob2 /DNDEBUG\"";

	};

	if (Fabricare.isStatic()) {

		cmdConfig += " -DBUILD_SHARED_LIBS=OFF";
		cmdConfig += " -DWIN32_MT_BUILD=ON";
		cmdConfig += " -DBUILD_LIBPYTHON_SHARED=OFF";
		cmdConfig += " -DCMAKE_MSVC_RUNTIME_LIBRARY=MultiThreaded";
		cmdConfig += " -DCMAKE_CXX_FLAGS_RELEASE=\"/MT /O2 /Ob2 /DNDEBUG\"";
		cmdConfig += " -DCMAKE_C_FLAGS_RELEASE=\"/MT /O2 /Ob2 /DNDEBUG\"";
		cmdConfig += " -DCMAKE_EXE_LINKER_FLAGS_INIT=\" crypt32.lib \"";
		cmdConfig += " -DPy_NO_ENABLE_SHARED=ON";

	};

	cmdConfig += " -DPYTHON_VERSION=" + Project.version;
	cmdConfig += " -DCMAKE_BUILD_TYPE=Release";
	cmdConfig += " -DBUILD_EXTENSIONS_AS_BUILTIN=OFF";

	cmdConfig += " -DBUILTIN_ARRAY=ON";
	cmdConfig += " -DBUILTIN_BINASCII=ON";
	cmdConfig += " -DBUILTIN_BISECT=ON";
	cmdConfig += " -DBSDDB=ON";
	cmdConfig += " -DBUILTIN_BZ2=ON";
	cmdConfig += " -DBUILTIN_CMATH=ON";
	cmdConfig += " -DBUILTIN_CODECS_CN=ON";
	cmdConfig += " -DBUILTIN_CODECS_HK=ON";
	cmdConfig += " -DBUILTIN_CODECS_ISO2022=ON";
	cmdConfig += " -DBUILTIN_CODECS_JP=ON";
	cmdConfig += " -DBUILTIN_CODECS_KR=ON";
	cmdConfig += " -DBUILTIN_CODECS_TW=ON";
	cmdConfig += " -DBUILTIN_COLLECTIONS=ON";
	cmdConfig += " -DBUILTIN_CPICKLE=ON";
	cmdConfig += " -DBUILTIN_CSTRINGIO=ON";
	cmdConfig += " -DBUILTIN_CSV=ON";
	cmdConfig += " -DBUILTIN_CTYPES=ON";
	cmdConfig += " -DBUILTIN_DATETIME=ON";
	cmdConfig += " -DBUILTIN_DBM=ON";
	cmdConfig += " -DBUILTIN_ELEMENTTREE=ON";
	cmdConfig += " -DBUILTIN_FCNTL=ON";
	cmdConfig += " -DBUILTIN_FUNCTOOLS=ON";
	cmdConfig += " -DBUILTIN_FUTURE_BUILTINS=ON";
	cmdConfig += " -DBUILTIN_GDBM=ON";
	cmdConfig += " -DBUILTIN_GRP=ON";
	cmdConfig += " -DBUILTIN_HASHLIB=ON";
	cmdConfig += " -DBUILTIN_HEAPQ=ON";
	cmdConfig += " -DBUILTIN_HOTSHOT=ON";
	cmdConfig += " -DBUILTIN_IO=ON";
	cmdConfig += " -DBUILTIN_ITERTOOLS=ON";
	cmdConfig += " -DBUILTIN_JSON=ON";
	cmdConfig += " -DBUILTIN_LOCALE=ON";
	cmdConfig += " -DBUILTIN_LSPROF=ON";
	cmdConfig += " -DBUILTIN_LZMA=ON";
	cmdConfig += " -DBUILTIN_MATH=ON";
	cmdConfig += " -DBUILTIN_MMAP=ON";
	cmdConfig += " -DBUILTIN_MULTIBYTECODEC=ON";
	cmdConfig += " -DBUILTIN_MULTIPROCESSING=ON";
	cmdConfig += " -DBUILTIN_NIS=ON";
	cmdConfig += " -DBUILTIN_NT=ON";
	cmdConfig += " -DBUILTIN_OPERATOR=ON";
	cmdConfig += " -DBUILTIN_PARSER=ON";
	cmdConfig += " -DBUILTIN_PWD=ON";
	cmdConfig += " -DBUILTIN_PYEXPAT=ON";
	cmdConfig += " -DBUILTIN_RANDOM=ON";
	cmdConfig += " -DBUILTIN_RESOURCE=ON";
	cmdConfig += " -DBUILTIN_SELECT=ON";
	cmdConfig += " -DBUILTIN_SOCKET=ON";
	cmdConfig += " -DBUILTIN_SPWD=ON";
	cmdConfig += " -DBUILTIN_STROP=ON";
	cmdConfig += " -DBUILTIN_STRUCT=ON";
	cmdConfig += " -DBUILTIN_TIME=ON";
	cmdConfig += " -DBUILTIN_UNICODEDATA=ON";
	cmdConfig += " -DBUILTIN_ZLIB=ON";

	cmdConfig += " -DWITH_STATIC_DEPENDENCIES=ON";
	cmdConfig += " -DBUILD_WININST=OFF";
	cmdConfig += " -DINSTALL_MANUAL=OFF";
	cmdConfig += " -DINSTALL_TEST=OFF";
	cmdConfig += " -DCMAKE_INSTALL_PREFIX=" + Shell.realPath(Shell.getcwd()) + "\\temp\\output";

	runInPath("temp/cmake", function () {
		exitIf(Shell.system(cmdConfig));
	});

	Shell.filePutContents("temp/build.config.flag", "done");
};

runInPath("temp/cmake", function () {
	exitIf(Shell.system("ninja"));
	exitIf(Shell.system("ninja install"));
	exitIf(Shell.system("ninja clean"));
});

Shell.copyFile("temp/output/libs/python312.lib","temp/output/libs/python.lib");
exitIf(!Shell.copyDirRecursively("temp/output/bin", "output/bin"));
exitIf(!Shell.copyDirRecursively("temp/output/include", "output/include/python"));
exitIf(!Shell.copyDirRecursively("temp/output/libs", "output/lib"));
exitIf(!Shell.copyDirRecursively("temp/output/lib", "output/opt/python"));

Shell.filePutContents("temp/build.done.flag", "done");

