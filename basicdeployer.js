/** @param {NS} ns */
export async function main(ns) {

	var servers = ns.scan();
	var virus = "virus1.js";
	var target = ns.args[0];

	for(let servName of servers){
		let maxThreads = Math.floor(ns.getServerMaxRam(servName) / ns.getScriptRam(virus));
		await ns.scp(virus, servName);
		ns.killall(servName);
		ns.exec(virus, servName, maxThreads, target);
	}

}
