/** @param {NS} ns */
export async function main(ns) {
	// scans network for unrooted servers and roots them if possible

	var scripts = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	}

	function scriptsOwned() {
		return Object.keys(scripts).filter(function (file) {
			return ns.fileExists(file, "home");
		}).length;
	}

	function canAdd(server) {
		return scriptsOwned(server) >= ns.getServerNumPortsRequired(server)
	}

	function addServ(server) {
		for (var file of Object.keys(scripts)) {
			if (ns.fileExists(file, home)) {
				var runScript = scripts[file];
				runScript(server);
			}
		}
		ns.nuke(server);
	}


// recursively scans all servers on network and gains root access
	function recurseScan(server) {
		var connected = ns.scan(server);
		if (connected.length = 1) {
			return;
		}
		else {
			for (var i = 0; i < connected.length; i++) {
				recurseScan(connected[i]);
			}
		}
		if (!ns.hasRootAccess(server)) {
			if (canAdd(server)) {
				addServ(server);
				ns.print("Added: " + server);
			}
		}
		return;
	}

	recurseScan("home");
}
