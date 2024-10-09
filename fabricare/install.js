// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.noInstall)) {
	if (Solution.noInstall) {
		return;
	};
};

// ---

messageAction("install");

Shell.removeDirRecursivelyForce(pathRepository + "/opt/python");
exitIf(!Shell.copyDirRecursively("output", pathRepository + "/opt/python"));

