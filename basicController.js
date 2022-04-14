/** 
 * basic controller will target single server with all availble ram
 * each virus is smaller due to logic being centralized allowing for more threads
 * 
 * @param {NS} ns */
export async function main(ns) {

	var target = ns.args[0];
	var minMoney = ns.getServerMaxMoney(target) * 0.75;
	var maxSecurity = ns.getServerMinSecurityLevel(target) + 5;
	var vweaken = "vweaken.js";
	var vhack = "vhack.js";
	var vgrow = "vgrow.js";

	let servers = [];
	let serversToScan = ns.scan("home");
	while (serversToScan.length > 0) {
		let server = serversToScan.shift();
		if (!servers.includes(server) && server !== "home") {
			servers.push(server);
			serversToScan = serversToScan.concat(ns.scan(server));
			await ns.scp(vweaken, server);
			await ns.scp(vhack, server);
			await ns.scp(vgrow, server);
		}
	}
	servers = servers.concat("home");

	while (true) {

		for (let server of servers) {
			if (ns.getServerSecurityLevel(target) > maxSecurity && getFreeThreads(server, vweaken) > 0) {
				ns.exec(vweaken, server, getFreeThreads(server, vweaken), target);
			}
			else if (ns.getServerMoneyAvailable(target) < minMoney && getFreeThreads(server, vweaken) > 0) {
				ns.exec(vgrow, server, getFreeThreads(server, vgrow), target);
			} else if (getFreeThreads(server, vweaken) > 0) {
				ns.exec(vweaken, server, getFreeThreads(server, vhack), target);
			}
		}
		await ns.sleep(ns.getHackTime(target));
	}

	function getFreeThreads(server, virus) {
		let freeThreads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(virus));
		return freeThreads;
	}
}
