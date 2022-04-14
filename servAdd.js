/** @param {NS} ns */
export async function main(ns) {
	// scans network for unrooted servers and roots them if possible

	var scripts = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	function scriptsOwned() {
		return Object.keys(scripts).filter(function (file) {
			return ns.fileExists(file, "home");
		}).length;
	}

	function canAdd(server) {
		return scriptsOwned(server) >= ns.getServerNumPortsRequired(server);
	}

	async function addServ(server) {
		for (var file of Object.keys(scripts)) {
			if (ns.fileExists(file, "home")) {
				var runScript = scripts[file];
				await runScript(server);
			}
		}
		await ns.nuke(server);
	}

	let servers = [];
	let serversToScan = ns.scan("home");
	while (serversToScan.length > 0) {
		let server = serversToScan.shift();
		if (!servers.includes(server) && server !== "home") {
			servers.push(server);
			serversToScan = serversToScan.concat(ns.scan(server));
			if (!ns.hasRootAccess(server) && canAdd(server)) {

				await addServ(server);
				ns.tprint("Added: " + server);
			}
		}

	}

}
