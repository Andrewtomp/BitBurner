/** 
 * script places targeted virus on rooted servers on the network.
 * kills scripts on all servers excluding home.
 * 
 * @param {NS} ns */
export async function main(ns) {

	var virus = "virus1.js";
	var target = ns.args[0];

	let servers = [];
	let serversToScan = ns.scan("home");
	while (serversToScan.length > 0) {
		let server = serversToScan.shift();
		if (!servers.includes(server) && server !== "home") {
			servers.push(server);
			serversToScan = serversToScan.concat(ns.scan(server));
		}
		if (ns.hasRootAccess(server)) {
			let maxThreads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(virus));
			if (server != "home") {
				await ns.scp(virus, server);
				ns.killall(server);
				if (maxThreads > 0) {
					ns.exec(virus, server, maxThreads, target);
				}
			}
			else {
				let freeThreads = Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) / ns.getScriptRam(virus));
				if (freeThreads > 0) {
					ns.exec(virus, "home", freeThreads, target);
				}

			}
		}
	}


}
